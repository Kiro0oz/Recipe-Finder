from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import Recipe, Tag
from .serializers import RecipeSerializer, TagSerializer
from django.db.models import Q


class RecipeListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response({
            "recipes": serializer.data,
            "total": recipes.count(),
        })

    def post(self, request):
        if not request.user.is_staff:
            return Response({"error": "Only admins can add recipes."}, status=status.HTTP_403_FORBIDDEN)

        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class RecipeDetailView(generics.RetrieveAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.AllowAny] 

class RecipeUpdateView(generics.UpdateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminUser]

class RecipeDeleteView(generics.DestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAdminUser]


class LimitRecipeListView(APIView):
    def get(self, request):
        limit = int(request.GET.get('limit', 10))
        skip = int(request.GET.get('skip', 0))
        select = request.GET.get('select', None)

        queryset = Recipe.objects.all()
        total = queryset.count()
        recipes = queryset[skip:skip + limit]

        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        data = serializer.data

        
        if select:
            selected_fields = select.split(',')
            if 'id' not in selected_fields:
                selected_fields.insert(0, 'id')

          
            data = [
                {key: recipe[key] for key in selected_fields if key in recipe}
                for recipe in data
            ]

        return Response({
            "recipes": data,
            "total": total,
            "skip": skip,
            "limit": limit
        }, status=status.HTTP_200_OK)
    
class RecipeSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({"detail": "Search query cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        recipes = Recipe.objects.filter(
            Q(name__icontains=query) |
            Q(cuisine__icontains=query) |
            Q(mealType__icontains=query) |
            Q(ingredients__icontains=query)
        )

        serializer = RecipeSerializer(recipes, many=True)
        return Response({
            "recipes": serializer.data,
            "total": recipes.count(),
            "query": query
        }, status=status.HTTP_200_OK)
    

class TagListView(APIView):
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response({"tags": serializer.data})
    

@api_view(['GET'])
def tag_names_list(request):
    tag_names = list(Tag.objects.values_list('name', flat=True))
    return Response(tag_names)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, recipe_id):
    user = request.user
    try:
        recipe = Recipe.objects.get(id=recipe_id)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'POST':
        user.favorites.add(recipe)
        return Response({'message': 'Recipe added to favorites.'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        user.favorites.remove(recipe)
        return Response({'message': 'Recipe removed from favorites.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    user = request.user
    recipes = user.favorites.all()
    serializer = RecipeSerializer(recipes, many=True, context={"request": request})
    return Response({"favorites": serializer.data}, status=status.HTTP_200_OK)