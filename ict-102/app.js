// ==================================================
// 1. DOM REFERENCES
// ==================================================

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

const recipeGrid = document.getElementById('recipeGrid');

const modalOverlay = document.getElementById('modalOverlay');
const openFormBtn = document.getElementById('openFormBtn');
const modalClose = document.getElementById('modalClose');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

const shoppingPanel = document.getElementById('shoppingPanel');
const shoppingItems = document.getElementById('shoppingItems');
const closeShoppingPanel = document.getElementById('closeShoppingPanel');


// ==================================================
// 2. DATA
// ==================================================

let recipes = [

    {
        id: 1,
        name: 'Jollof Rice',
        category: 'dinner',
        cuisine: 'Nigerian',
        emoji: '🍚',
        ingredients: [
            '2 cups rice',
            'Tomato paste',
            'Onions',
            'Seasoning',
            'Chicken stock'
        ],
        instructions: 'Fry tomato base, add stock, cook rice in sauce.',
        isFavorite: false
    },

    {
        id: 2,
        name: 'Avocado Toast',
        category: 'breakfast',
        cuisine: 'International',
        emoji: '🥑',
        ingredients: [
            '2 slices bread',
            '1 ripe avocado',
            'Salt',
            'Pepper',
            'Lemon'
        ],
        instructions: 'Toast bread. Mash avocado with lemon and salt. Spread.',
        isFavorite: false
    },

    {
        id: 3,
        name: 'Chicken Pasta',
        category: 'dinner',
        cuisine: 'Italian',
        emoji: '🍝',
        ingredients: [
            '200g pasta',
            'Chicken breast',
            'Cream',
            'Garlic',
            'Parmesan'
        ],
        instructions: 'Cook pasta. Fry garlic and chicken, add cream, toss.',
        isFavorite: true
    },

    {
        id: 4,
        name: 'Mango Smoothie',
        category: 'snack',
        cuisine: 'Tropical',
        emoji: '🥭',
        ingredients: [
            '2 mangoes',
            '1 cup milk',
            'Honey',
            'Ice cubes'
        ],
        instructions: 'Blend all until smooth. Serve cold.',
        isFavorite: false
    },

    {
        id: 5,
        name: 'Chocolate Cake',
        category: 'dessert',
        cuisine: 'American',
        emoji: '🎂',
        ingredients: [
            'Flour',
            'Cocoa',
            'Sugar',
            'Eggs',
            'Butter',
            'Milk',
            'Baking powder'
        ],
        instructions: 'Mix ingredients, bake at 180°C for 35 minutes.',
        isFavorite: false
    }

];


// ==================================================
// 3. LOCAL STORAGE
// ==================================================

function saveToStorage() {

    localStorage.setItem(
        'recipebookData',
        JSON.stringify(recipes)
    );

}

function loadFromStorage() {

    const storedRecipes =
        localStorage.getItem('recipebookData');

    if (storedRecipes !== null) {

        recipes = JSON.parse(storedRecipes);

    }

}


// ==================================================
// 4. RENDER RECIPES
// ==================================================

function renderRecipes(recipesToShow) {

    if (recipesToShow.length === 0) {

        recipeGrid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🍽</div>
                <p>No recipes found. Try adding one!</p>
            </div>
        `;

        return;
    }

    let html = '';

    recipesToShow.forEach(function(recipe) {

        const preview =
            recipe.ingredients
            .slice(0, 3)
            .map(function(ingredient) {

                return `
                    <span style="
                        font-size:0.8rem;
                        color:#6B7280;
                    ">
                        • ${ingredient}
                    </span>
                `;

            })
            .join('<br>');

        const heart =
            recipe.isFavorite ? '❤' : '🤍';

        const favoriteClass =
            recipe.isFavorite
            ? 'btn-icon btn-favorite active'
            : 'btn-icon btn-favorite';

        html += `
            <div class="card">

                <div class="card-header">
                    ${recipe.emoji || '🍽'}
                </div>

                <div class="card-body">

                    <h3 class="card-title">
                        ${recipe.name}
                    </h3>

                    <span class="card-badge">
                        ${recipe.category}
                    </span>

                    <p class="card-cuisine">
                        Cuisine: ${recipe.cuisine}
                    </p>

                    <div style="margin-top:8px">
                        ${preview}
                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn-icon btn-delete"
                        data-id="${recipe.id}"
                    >
                        🗑 Delete
                    </button>

                    <button
                        class="btn-icon btn-shopping"
                        data-id="${recipe.id}"
                    >
                        🛒 Shop
                    </button>

                    <button
                        class="${favoriteClass}"
                        data-id="${recipe.id}"
                    >
                        ${heart} Fav
                    </button>

                </div>

            </div>
        `;

    });

    recipeGrid.innerHTML = html;

    attachCardEvents();

}


// ==================================================
// 5. CARD EVENTS
// ==================================================

function attachCardEvents() {

    // DELETE BUTTONS
    const deleteButtons =
        document.querySelectorAll('.btn-delete');

    deleteButtons.forEach(function(button) {

        button.addEventListener('click', function() {

            const id = Number(this.dataset.id);

            const confirmDelete =
                confirm('Delete this recipe?');

            if (!confirmDelete) return;

            recipes = recipes.filter(function(recipe) {

                return recipe.id !== id;

            });

            saveToStorage();

            renderRecipes(recipes);

        });

    });


    // FAVORITE BUTTONS
    const favoriteButtons =
        document.querySelectorAll('.btn-favorite');

    favoriteButtons.forEach(function(button) {

        button.addEventListener('click', function() {

            toggleFavorite(
                Number(this.dataset.id)
            );

        });

    });


    // SHOPPING BUTTONS
    const shoppingButtons =
        document.querySelectorAll('.btn-shopping');

    shoppingButtons.forEach(function(button) {

        button.addEventListener('click', function() {

            openShoppingList(
                Number(this.dataset.id)
            );

        });

    });

}


// ==================================================
// 6. HAMBURGER MENU
// ==================================================

hamburger.addEventListener('click', function() {

    nav.classList.toggle('open');

});


// ==================================================
// 7. MODAL
// ==================================================

// OPEN MODAL
openFormBtn.addEventListener('click', function() {

    modalOverlay.classList.add('open');

});


// CLOSE MODAL WITH X
modalClose.addEventListener('click', function() {

    modalOverlay.classList.remove('open');

});


// CLOSE MODAL WHEN CLICKING OUTSIDE
modalOverlay.addEventListener('click', function(event) {

    if (event.target === modalOverlay) {

        modalOverlay.classList.remove('open');

    }

});


// SAVE RECIPE
saveRecipeBtn.addEventListener('click', function() {

    const name =
        document.getElementById('recipeName')
        .value
        .trim();

    const category =
        document.getElementById('recipeCategory')
        .value;

    const cuisine =
        document.getElementById('recipeCuisine')
        .value
        .trim();

    const emoji =
        document.getElementById('recipeEmoji')
        .value
        .trim() || '🍽';

    const instructions =
        document.getElementById('recipeInstructions')
        .value
        .trim();

    const ingredients =
        document.getElementById('recipeIngredients')
        .value
        .split('\n')
        .map(function(line) {

            return line.trim();

        })
        .filter(Boolean);


    // VALIDATION
    if (!name || ingredients.length === 0) {

        alert(
            'Please enter a name and at least one ingredient.'
        );

        return;
    }


    // CREATE NEW RECIPE
    const newRecipe = {

        id: Date.now(),

        name: name,

        category: category,

        cuisine: cuisine || 'Not specified',

        emoji: emoji,

        ingredients: ingredients,

        instructions: instructions,

        isFavorite: false

    };


    // ADD TO ARRAY
    recipes.push(newRecipe);

    saveToStorage();

    renderRecipes(recipes);


    // CLOSE MODAL
    modalOverlay.classList.remove('open');


    // CLEAR FORM
    clearForm();

});


// ==================================================
// 8. CLEAR FORM
// ==================================================

function clearForm() {

    document.getElementById('recipeName').value = '';

    document.getElementById('recipeCuisine').value = '';

    document.getElementById('recipeIngredients').value = '';

    document.getElementById('recipeInstructions').value = '';

    document.getElementById('recipeEmoji').value = '';

}


// ==================================================
// 9. SEARCH & FILTER
// ==================================================

searchInput.addEventListener('input', function() {

    applyFilters();

});

categoryFilter.addEventListener('change', function() {

    applyFilters();

});


function applyFilters() {

    const searchTerm =
        searchInput.value
        .toLowerCase()
        .trim();

    const selectedCategory =
        categoryFilter.value;

    const filteredRecipes =
        recipes.filter(function(recipe) {

            const nameMatch =
                recipe.name
                .toLowerCase()
                .includes(searchTerm);

            const cuisineMatch =
                recipe.cuisine
                .toLowerCase()
                .includes(searchTerm);

            const textMatch =
                nameMatch || cuisineMatch;

            const categoryMatch =
                selectedCategory === 'all'
                || recipe.category === selectedCategory;

            return textMatch && categoryMatch;

        });

    renderRecipes(filteredRecipes);

}


// ==================================================
// 10. SHOPPING LIST
// ==================================================

closeShoppingPanel.addEventListener('click', function() {

    shoppingPanel.classList.remove('open');

});


function openShoppingList(recipeId) {

    const recipe =
        recipes.find(function(recipe) {

            return recipe.id === recipeId;

        });

    if (!recipe) return;


    const itemsHTML =
        recipe.ingredients
        .map(function(ingredient) {

            return `
                <div class="shopping-item">
                    🛒 ${ingredient}
                </div>
            `;

        })
        .join('');


    shoppingItems.innerHTML = `

        <p style="
            font-weight:600;
            color:#40916C;
            margin-bottom:16px;
        ">
            ${recipe.emoji} ${recipe.name}
        </p>

        ${itemsHTML}

        <p style="
            margin-top:16px;
            color:#6B7280;
            font-size:0.85rem;
        ">
            ${recipe.ingredients.length} items total
        </p>

    `;

    shoppingPanel.classList.add('open');

}


// ==================================================
// 11. FAVORITES
// ==================================================

function toggleFavorite(recipeId) {

    const recipe =
        recipes.find(function(recipe) {

            return recipe.id === recipeId;

        });

    if (!recipe) return;


    recipe.isFavorite =
        !recipe.isFavorite;

    saveToStorage();

    renderRecipes(recipes);

}


// ==================================================
// 12. INIT
// ==================================================

function init() {

    loadFromStorage();

    renderRecipes(recipes);

}

init();