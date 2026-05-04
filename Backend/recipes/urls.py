from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, RecipeUpdateView, RecipeDeleteView, LimitRecipeListView, RecipeSearchView, TagListView, tag_names_list,toggle_favorite,get_favorites

urlpatterns = [
    path('', RecipeListCreateView.as_view(), name='recipes'),
    path('<int:pk>/single/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('<int:pk>/update/', RecipeUpdateView.as_view(), name='recipe-update'),
    path('<int:pk>/delete/', RecipeDeleteView.as_view(), name='recipe-delete'),
    path('limit/', LimitRecipeListView.as_view(), name='recipe-filter'),
    path('search/', RecipeSearchView.as_view(), name='recipe-search'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('tags/names/', tag_names_list, name='tag-names-list'),
    path('favorites/<int:recipe_id>/', toggle_favorite, name='add_to_favorites'),
    path('favorites/', get_favorites, name='get_favorites'),
]
