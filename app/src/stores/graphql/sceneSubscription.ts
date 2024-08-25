export default `
subscription{
        scenes_mutated {
            key
            event
            data{
                    id
                    title
                    description
                    type
                    text
                    media{
                        id
                        type
                    }
                    options{
                        options_id{
                            id
                            key
                            value
                        }
                    }
            }
        }
    }
`;
