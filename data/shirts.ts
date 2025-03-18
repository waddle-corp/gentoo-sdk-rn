export interface Shirt {
    id: string;
    name: string;
    price: number;
    image: string;
}

const SHIRTS: Shirt[] = [
    {
        id: '1',
        name: 'Shirt 1',
        price: 100,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: '2',
        name: 'Shirt 2',
        price: 200,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: '3',
        name: 'Shirt 3',
        price: 300,
        image: 'https://via.placeholder.com/150',
    },
];

export default SHIRTS;