async function fetchRecipes(category) {
    try {
        const response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${category}`);
        const data = await response.json();
        
        if (data.recipes && data.recipes.length > 0) {
            return data.recipes.map(recipe => ({
                id: recipe.recipe_id,
                title: recipe.title,
                image: recipe.image_url,
                source: recipe.source_url,
                publisher: recipe.publisher,
                publishDate: recipe.publisher_url || 'Not available'
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

async function which_category(category) {
    const mainSection = document.querySelector('.main_section');
    mainSection.style.display = 'block';
    mainSection.style.flexDirection = '';

    mainSection.innerHTML = '';
    
    const categoryTitle = document.createElement('h1');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category + ' Recipes';
    mainSection.appendChild(categoryTitle);
// ========================================
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Loading recipes...';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.padding = '50px';
    loadingDiv.style.paddingTop = '400px';
    loadingDiv.style.fontWeight = 'bold';
    loadingDiv.style.fontSize = '2em';
    loadingDiv.style.color = '#666';
    mainSection.appendChild(loadingDiv);
// ========================================
    const recipes = await fetchRecipes(category);

    mainSection.removeChild(loadingDiv);
    
    if (recipes.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No recipes found for this category.';
        noResultsDiv.style.textAlign = 'center';
        noResultsDiv.style.padding = '50px';
        noResultsDiv.style.paddingTop = '300px';
        noResultsDiv.style.fontWeight = 'bold';
        noResultsDiv.style.fontSize = '1.2em';
        noResultsDiv.style.color = '#666';
        mainSection.appendChild(noResultsDiv);
        return;
    }
    
    const recipesContainer = document.createElement('div');
    recipesContainer.className = 'recipes-container';
    
    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });
    
    mainSection.appendChild(recipesContainer);
}
let categoryRequestTimer;
function delayedCategoryRequest(category) {
    clearTimeout(categoryRequestTimer);
    categoryRequestTimer = setTimeout(() => {which_category(category); }, 1000);
}


function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <div class="recipe-image">
            <img src="${recipe.image}" alt="${recipe.title}">
        </div>
        <div class="recipe-content">
            <h2 class="recipe-title">${recipe.title}</h2>
            <div class="recipe-buttons">
                <button class="btn-source" onclick="window.open('${recipe.source}', '_blank')">Source</button>
                <button class="btn-details" onclick="showRecipeDetails('${recipe.id}')">Details</button>
            </div>
        </div>
    `;
    
    return card;
}

async function RecipeDetails(id2) {
    const response= await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id2}`);
    const data = await response.json();
    return data.recipe;
}

async function showRecipeDetails(recipeId) {
    const recipe = await RecipeDetails(recipeId);
    console.log(recipe);
    const modal = document.getElementById('recipeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalInfo = document.getElementById('modalInfo');

    modalTitle.textContent = recipe.title;

    modalInfo.innerHTML = `
        <div class="details-layout" style="display: flex; gap: 20px; align-items: flex-start;">
            <div class="details-image">
                <img src="${recipe.image_url}" alt="${recipe.title}" style="width: 220px; border-radius: 15px; object-fit: cover;" />
            </div>
            <div class="details-text" style="flex: 1;">
                <div class="modal-info-item" style="flex-direction: column; align-items: flex-start;">
                    <span class="modal-info-label">Ingredients:</span>
                    <ul class="modal-info-value" style="padding-left: 20px;">
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
    
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('recipeModal');

    const mainSection = document.querySelector('.main_section');
    if (mainSection) {
        mainSection.style.display = 'flex';
        mainSection.style.flexDirection = 'row';
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    console.log('Food Recipes page loaded');
});

