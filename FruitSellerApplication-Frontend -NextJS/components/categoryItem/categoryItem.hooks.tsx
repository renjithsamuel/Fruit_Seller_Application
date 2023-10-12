import { categoryItem } from "@/entity/category";

export function useCategoryList(
  categories: categoryItem[],
  selectedCategory: string,
  setSelectedCategory: (category: string) => void
) {
  const handleCategory = (category: string) => {
    if (selectedCategory.toLowerCase() === category.toLowerCase()) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  return { selectedCategory, setSelectedCategory, handleCategory, categories };
}
