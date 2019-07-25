import gql from 'graphql-tag';

export const MESSAGE_QUERY = gql`
  query messageQuery($filter: String, $skip: Int, $first: Int, $orderBy: MessageOrderByInput) {
    messages(filter: $filter, skip: $skip, first: $first, orderBy: $orderBy) {
      count
      messageList {
        id
        text
        likeCount
        dislikeCount
        responses {
          id
          text
          likeCount
          dislikeCount
        }
      }
    }
  }
`;

export const POST_MESSAGE_MUTATION = gql`
  mutation PostMutation($text: String!) {
    postMessage(text: $text) {
      id
      text
      likeCount
      dislikeCount
      responses {
        id
        text
        likeCount
        dislikeCount
      }
    }
  }
`;

export const POST_RESPONSE_MUTATION = gql`
  mutation PostMutation($messageId: ID!, $text: String!) {
    postResponse(messageId: $messageId, text: $text) {
      id
      text
      likeCount
      dislikeCount
      message {
        id
      }
    }
  }
`;

export const POST_MESSAGE_LIKE_MUTATION = gql`
  mutation PostMutation($messageId: ID!) {
    postMessageLike(messageId: $messageId) {
      id
      likeCount
    }
  }
`;

export const POST_MESSAGE_DISLIKE_MUTATION = gql`
  mutation PostMutation($messageId: ID!) {
    postMessageDislike(messageId: $messageId) {
      id
      dislikeCount
    }
  }
`;

export const POST_RESPONSE_LIKE_MUTATION = gql`
  mutation PostMutation($responseId: ID!) {
    postResponseLike(responseId: $responseId) {
      id
      likeCount
      message {
        id
      }
    }
  }
`;

export const POST_RESPONSE_DISLIKE_MUTATION = gql`
  mutation PostMutation($responseId: ID!) {
    postResponseDislike(responseId: $responseId) {
      id
      dislikeCount
      message {
        id
      }
    }
  }
`;

export const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      id
      text
      likeCount
      dislikeCount
      responses {
        id
        text
        likeCount
        dislikeCount
      }
    }
  }
`;

export const NEW_RESPONSES_SUBSCRIPTION = gql`
  subscription {
    newResponse {
      id
      text
      likeCount
      dislikeCount
      message {
        id
      }
    }
  }
`;

export const MESSAGE_ACTION_SUBSCRIPTION = gql`
  subscription {
    newMessageAction {
      id
      text
      likeCount
      dislikeCount
      responses {
        id
        text
        likeCount
        dislikeCount
      }
    }
  }
`;

export const RESPONSE_ACTION_SUBSCRIPTION = gql`
  subscription {
    newResponseAction {
      id
      text
      likeCount
      dislikeCount
    }
  }
`;