from django.db import models
import uuid
from django.utils.text import slugify
# Create your models here.

class Poll(models.Model):
    """Модель опроса"""
    question = models.TextField(verbose_name="Вопрос")
    allow_multiple = models.BooleanField(
        default=False, 
        verbose_name="Разрешить несколько ответов"
    )
    slug = models.SlugField(
        unique=True, 
        default=uuid.uuid4, 
        editable=False,
        verbose_name="Уникальная ссылка"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    
    class Meta:
        verbose_name = "Опрос"
        verbose_name_plural = "Опросы"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.question[:50]
    
    def save(self, *args, **kwargs):
        # Если slug не задан, генерируем из вопроса
        if not self.slug:
            self.slug = slugify(self.question)[:50]
            # Проверка на уникальность
            while Poll.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{uuid.uuid4().hex[:6]}"
        super().save(*args, **kwargs)

class Option(models.Model):
    """Вариант ответа"""
    poll = models.ForeignKey(
        Poll, 
        on_delete=models.CASCADE, 
        related_name='options',
        verbose_name="Опрос"
    )
    option_text = models.TextField(verbose_name="Текст варианта")
    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Порядок отображения"
    )
    
    class Meta:
        verbose_name = "Вариант ответа"
        verbose_name_plural = "Варианты ответов"
        ordering = ['order', 'id']
        unique_together = ['poll', 'option_text']  # уникальность текста в рамках опроса
    
    def __str__(self):
        return f"{self.option_text[:30]}..."
    
    @property
    def votes_count(self):
        """Количество голосов за этот вариант"""
        return self.votes.count()

class Vote(models.Model):
    """Голос пользователя"""
    option = models.ForeignKey(
        Option, 
        on_delete=models.CASCADE, 
        related_name='votes',
        verbose_name="Вариант"
    )
    session_key = models.CharField(
        max_length=100,
        verbose_name="Ключ сессии"
    )
    voted_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Время голосования"
    )
    
    class Meta:
        verbose_name = "Голос"
        verbose_name_plural = "Голоса"
        unique_together = ['option', 'session_key']  # защита от повторного голосования
        indexes = [
            models.Index(fields=['session_key']),
            models.Index(fields=['option', 'session_key']),
        ]
    
    def __str__(self):
        return f"Голос за {self.option.option_text[:20]}..."