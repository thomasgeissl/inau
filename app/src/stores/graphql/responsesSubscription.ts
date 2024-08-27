export default `
subscription{
        responses_mutated {
            key
            event
            data{
                id
                show{
                    id
                }
                user
                scene{
                    id
                }
                value
            }
        }
    }
`;
