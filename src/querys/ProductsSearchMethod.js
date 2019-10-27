import axios from "axios";

export default function ProductsSearchMethod(id, search = '', categoryId = null) {
    const query = `query poc($id: ID!, $categoryId: Int, $search: String){
            poc(id: $id) {
            id
            products(categoryId: $categoryId, search: $search) {
                id
                title
                rgb
                images {
                url
                }
                productVariants {
                availableDate
                productVariantId
                price
                inventoryItemId
                shortDescription
                title
                published
                volume
                volumeUnit
                description
                subtitle
                components {
                    id
                    productVariantId
                    productVariant {
                    id
                    title
                    description
                    shortDescription
                    }
                }
                }
            }
        }
    }`;

    const getPOCGraphQL = axios.create({
        baseURL: 'https://api.zx-courier.com/public/graphql',
        headers: {
            'x-api-key': 'VwdfoqVJBW5VwaqFhalF82YXBfO55Bb3Zii7w87h',
            'x-request-origin': 'WEB',
            'content-type': 'application/json',
        }
    });

    return getPOCGraphQL.post('', {
        operationName: "poc",
        query: query,
        variables: {
            "id": id,
            "search": search,
            "categoryId": categoryId
        }
    });
}