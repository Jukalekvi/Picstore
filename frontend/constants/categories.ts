export interface Category {
    id: number;
    name: string;
    icon: string;
}

export const CATEGORIES: Category[] = [
    { id: 1, name: 'Mammals', icon: 'paw' },
    { id: 2, name: 'Birds', icon: 'feather' },
    { id: 3, name: 'Reptiles', icon: 'turtle' },
    { id: 4, name: 'Insects', icon: 'bug' },
    { id: 5, name: 'Plants', icon: 'flower' },
    { id: 6, name: 'Trees', icon: 'tree' },
    { id: 7, name: 'Mushrooms', icon: 'mushroom' },
    { id: 8, name: 'Undefined', icon: 'help-circle' },
];

export const getCategoryById = (id: number) =>
    CATEGORIES.find(cat => cat.id === id) || CATEGORIES[7];