import axios from "axios";

export default function CategoriesSearchMethod(address) {
    const query = `query allCategoriesSearch {
            allCategory{
                title
                id
            }
        }
    `;

    const getPOCGraphQL = axios.create({
        baseURL: 'https://api.zx-courier.com/public/graphql',
        headers: {
            'x-api-key': 'VwdfoqVJBW5VwaqFhalF82YXBfO55Bb3Zii7w87h',
            'x-request-origin': 'WEB',
            'content-type': 'application/json',
        }
    });

    return getPOCGraphQL.post('', {
        query: query
    });
}