import axios from "axios";

export default function PocSearchMethod(address) {
    const query = `query pocSearchMethod($now: DateTime!, $algorithm: String!, $lat: String!, $long: String!) {
        pocSearch(now: $now, algorithm: $algorithm, lat: $lat, long: $long) {
            id
            status
            pocWorkDay {
            weekDay
            active
            workingInterval {
                openingTime
                closingTime
                __typename
            }
            __typename
            }
            __typename
        }
    }`;

    const dateNow = (() => {
        const date = new Date();
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${('0' + (date.getHours() + 1)).slice(-2)}:${('0' + (date.getMinutes() + 1)).slice(-2)}:${('0' + (date.getSeconds() + 1)).slice(-2)}.000Z`;
    })

    const getPOCGraphQL = axios.create({
        baseURL: 'https://api.zx-courier.com/public/graphql',
        headers: {
            'x-api-key': 'VwdfoqVJBW5VwaqFhalF82YXBfO55Bb3Zii7w87h',
            'x-request-origin': 'WEB',
            'content-type': 'application/json',
        }
    });

    return getPOCGraphQL.post('', {
        query: query,
        variables: {
            "algorithm": "NEAREST",
            "lat": address.lat,
            "long": address.lng,
            "now": dateNow()
        }
    });
}