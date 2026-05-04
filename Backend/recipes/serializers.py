from rest_framework import serializers
from .models import Recipe, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class RecipeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)
    # user = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.SerializerMethodField()
    
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source='tags'
    )

    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'ingredients', 'instructions',
            'prepTimeMinutes', 'cookTimeMinutes', 'servings',
            'cuisine', 'caloriesPerServing', 'tags', 'tag_ids',
            'user', 'image', 'rating', 'mealType', 'is_favorited'
        ]

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(id=request.user.id).exists()
        return False
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data
    
    def get_user(self, obj): 
        return f"{obj.user.first_name} {obj.user.last_name}"

