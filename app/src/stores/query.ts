import { gql, request } from 'graphql-request';

const query = gql`
  {
    shows{
        id
        title
        scenes{
            scenes_id{
                id
                title
                description
                type
                text
                media{
                  id
                  type
                }
            }

        }
    }
  }
`;

export default query;