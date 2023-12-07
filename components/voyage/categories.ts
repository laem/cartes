import categories from '@/app/voyage/categories.yaml'

export const getCategory = (searchParams) => {
	const categoryName = searchParams.cat,
		category = categoryName && categories.find((c) => c.name === categoryName)
	return category
}
