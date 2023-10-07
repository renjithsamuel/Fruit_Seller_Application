import "./Category.css"



function Category({category,selectedCategory,setSelectedCategory}) {

    const handleClick = () =>{
        if (selectedCategory == category.category){
            setSelectedCategory("")
        }else {
            setSelectedCategory(category.category)
        }
    }

    return <div className="categoryWrapper" onClick={handleClick} style={{outline:(selectedCategory!=category.category)?"none":"double"}}>
        <div className="categoryTop">
                <img src={`${import.meta.env.PUBLIC_URL}/${category.imageUrl}.svg`} alt="category" width={30} height={30} />
        </div>
        <div className="categoryName">
            <div className="categoryImage">
                {category.category}
            </div>
        </div>
    </div>
}

export default Category