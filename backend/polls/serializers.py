from rest_framework import serializers
from .models import Poll, Option, Vote

class OptionSerializer(serializers.ModelSerializer):
    """Сериализация варианта ответа"""
    votes_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Option
        fields = ['id', 'option_text', 'order', 'votes_count']
        read_only_fields = ['id']
        
class PollListSerializer(serializers.ModelSerializer):
    """Сериализация опроса для списка"""
    option_count = serializers.IntegerField(source='options.count', read_only=True)
    
    class Meta:
        model = Poll
        fields = ['id', 'question', 'slug', 'created_at', 'options_count']
        
class PollDetailSerializer(serializers.ModelSerializer):
    """Сериализация опроса для деталей"""
    options = OptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Poll
        fields = ['question', 'allow_multiple', 'slug', 'created_at', 'options']

class PollCreateSerializer(serializers.ModelSerializer):
    """Сериализация опроса для создания"""
    options = serializers.ListField(
        child = serializers.CharField(max_length=200),
        write_only=True,
        min_length = 1,
        max_length = 10,
    )
    
    class Meta:
        model = Poll
        fields = ['options', 'slug']
        
    def validate_options(self, value):
        '''проверяем уникальность вариантов'''
        if len(value) != len(set(value)):
            raise serializers.ValidationError('Варианты ответов должны быть уникальными')
        return value
    
    def create(self, validated_data):
        option_data = validated_data.pop('options')
        poll = Poll.objects.create(**validated_data)
        
        for i, option_text in enumerate(option_data):
            Option.objects.create(
                poll = poll,
                option_text = option_text,
                order = i,
            )
        return poll

class VoteSerializer(serializers.Serializer):
    '''Сериализатор для голосования'''
    option_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    session_key = serializers.CharField(max_length=100, required=False)
    
    def validate_option_ids(self, value):
        """Проверяем, что все варианты существуют"""
        options = Option.objects.filter(id__in=value)
        if len(options) != len(value):
            raise serializers.ValidationError("Некоторые варианты ответов не найдены")
        
        # Проверяем, что все варианты из одного опроса
        poll_ids = set(options.values_list('poll_id', flat=True))
        if len(poll_ids) > 1:
            raise serializers.ValidationError("Все варианты должны быть из одного опроса")
        
        # Проверяем ограничение на множественный выбор
        poll = options.first().poll
        if not poll.allow_multiple and len(value) > 1:
            raise serializers.ValidationError(
                "Этот опрос не разрешает выбирать несколько вариантов"
            )
        
        return value
    
class VoteResultSerializer(serializers.ModelSerializer):
    """Сериализатор для результатов голосования"""
    options = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    user_voted = serializers.SerializerMethodField()
    
    class Meta:
        model = Poll
        fields = ['id', 'question', 'allow_multiple', 'slug', 'options', 'total_votes', 'user_voted']
    
    def get_options(self, obj):
        """Возвращаем варианты с количеством голосов"""
        options = obj.options.all()
        return OptionSerializer(options, many=True).data
    
    def get_total_votes(self, obj):
        """Общее количество голосов в опросе"""
        return Vote.objects.filter(option__poll=obj).count()
    
    def get_user_voted(self, obj):
        """Проверяем, голосовал ли пользователь"""
        request = self.context.get('request')
        if request and hasattr(request, 'session'):
            session_key = request.session.session_key
            if session_key:
                return Vote.objects.filter(
                    option__poll=obj,
                    session_key=session_key
                ).exists()
        return False