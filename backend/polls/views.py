from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Poll, Option, Vote
from .serializers import (
    PollListSerializer, PollDetailSerializer, 
    PollCreateSerializer, VoteSerializer, VoteResultSerializer
)

class PollViewSet(viewsets.ModelViewSet):
    """API для работы с опросами"""
    permission_classes = [AllowAny]
    queryset = Poll.objects.all()
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PollListSerializer
        elif self.action == 'create':
            return PollCreateSerializer
        elif self.action in ['retrieve', 'results']:
            return PollDetailSerializer
        return PollDetailSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['get'])
    def results(self, request, slug=None):
        """Получение результатов опроса"""
        poll = self.get_object()
        serializer = VoteResultSerializer(poll, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def vote(self, request):
        """Обработка голосования"""
        # Получаем или создаем сессию
        if not request.session.session_key:
            request.session.create()
        
        session_key = request.session.session_key
        
        # Валидируем данные
        serializer = VoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        option_ids = serializer.validated_data['option_ids']
        
        # Проверяем, что варианты существуют и принадлежат одному опросу
        options = Option.objects.filter(id__in=option_ids).select_related('poll')
        poll = options.first().poll
        
        # Проверяем, не голосовал ли пользователь уже за эти варианты
        existing_votes = Vote.objects.filter(
            option__in=options,
            session_key=session_key
        ).values_list('option_id', flat=True)
        
        if existing_votes:
            return Response(
                {'error': 'Вы уже голосовали за некоторые варианты'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Создаем голоса
        votes = []
        for option in options:
            votes.append(Vote(option=option, session_key=session_key))
        
        Vote.objects.bulk_create(votes)
        
        # Возвращаем ссылку на результаты
        return Response({
            'message': 'Голос успешно принят',
            'results_url': f'/api/polls/{poll.slug}/results/'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def check_vote(self, request, slug=None):
        """Проверка, голосовал ли пользователь в этом опросе"""
        poll = self.get_object()
        session_key = request.session.session_key
        
        if not session_key:
            return Response({'voted': False})
        
        voted = Vote.objects.filter(
            option__poll=poll,
            session_key=session_key
        ).exists()
        
        return Response({'voted': voted})