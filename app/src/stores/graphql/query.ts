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
    responses{
      show{
        id
      }
      user
      scene{
        id
      }
      value
    }
    users{
      id
      show{
        id
      }
      date_created
      date_updated
    }
  }
`;

export default query;