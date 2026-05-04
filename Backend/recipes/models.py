from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model): 
    name = models.CharField(max_length=255)
    ingredients = models.JSONField()
    instructions = models.JSONField()
    prepTimeMinutes = models.IntegerField()
    cookTimeMinutes = models.IntegerField()
    servings = models.IntegerField()
    cuisine = models.CharField(max_length=100)
    caloriesPerServing = models.IntegerField()
    tags = models.ManyToManyField(Tag, related_name='recipes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    rating = models.FloatField(default=0.0)
    mealType = models.JSONField()

    def __str__(self):
        return self.name
