import shops from '../../data/accshop.json'


export function getCategoriesFilter(){
    const categories = new Map()
    const array = Object.entries(shops.Data.accountStores.tools)

    array.forEach(([_,data])=>{
        Object.keys(data.productsByCategory).forEach(key=>{
            if(!categories.has(key)){
                categories.set(key, {name: key})
            }

        })
    })


    return Array.from(categories?.entries()).map(item=>item[1])
}

export function getCategoriesItemsFilter(category){
    if(!category) return

    const categories = new Map()
    const array = Object.entries(shops.Data.accountStores.tools)

    array.forEach(([_,data])=>{
        data.productsByCategory[category]?.split(',').forEach(key=>{
            if(!categories.has(key)){
                categories.set(key, {name: key})
            }

        })
    })


    return Array.from(categories?.entries()).map(item=>item[1])
}
