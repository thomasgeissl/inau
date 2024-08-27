export default `
subscription{
        responses_mutated {
            key
            event
            data{
                id
            }
        }
    }
`;
