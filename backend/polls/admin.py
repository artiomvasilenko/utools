from django.contrib import admin
from .models import Poll, Option, Vote

class OptionInline(admin.TabularInline):
    model = Option
    extra = 1

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ['question', 'allow_multiple', 'slug', 'created_at']
    list_filter = ['allow_multiple', 'created_at']
    search_fields = ['question', 'slug']
    inlines = [OptionInline]

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['option_text', 'poll', 'order', 'votes_count']
    list_filter = ['poll']
    search_fields = ['option_text']

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['option', 'session_key', 'voted_at']
    list_filter = ['voted_at']
    search_fields = ['session_key']