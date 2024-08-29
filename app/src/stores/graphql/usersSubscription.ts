export default `
subscription{
        users_mutated {
            key
            event
            data{
                id
                show{
                    id
                }
                date_created
                date_updated
            }
        }
    }
`;
