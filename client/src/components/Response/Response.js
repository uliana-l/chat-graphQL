import React from 'react';
import { Message, Label, Icon } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { POST_RESPONSE_LIKE_MUTATION, POST_RESPONSE_DISLIKE_MUTATION, MESSAGE_QUERY } from '../../queries';

const Response = ({ response, skip }) => {
    const { id, text, likeCount, dislikeCount } = response;

    const _updateStoreAfterAddingReaction = (store, updatedResponse) => {
        const orderBy = 'createdAt_DESC';
        const data = store.readQuery({
          query: MESSAGE_QUERY,
          variables: {
            orderBy,
            filter: '',
            skip,
            first: 6
          }
        });

        const message = data.messages.messageList.filter(message => message.id === updatedResponse.message.id)[0];
        
        if (updatedResponse.likeCount) {
          message.responses = message.responses.map(item =>  item.id === updatedResponse.id ? 
            { ...item, likeCount: updatedResponse.likeCount } 
            : 
            item
          );
        } else {
          message.responses = message.responses.map(item => item.id === updatedResponse.id ?
            { ...item, dislikeCount: updatedResponse.dislikeCount }
            :
            item
          );
        }

        data.messages.messageList = data.messages.messageList.map(item => item.id === message.id ?
            message
            :
            item
        );
        
        store.writeQuery({
          query: MESSAGE_QUERY,
          data
        });
    };

    return (
        <Message size="mini">
            <Message.Header>
                #{id.slice(-3)}
            </Message.Header>
            <Message.Content>
                {text}
            </Message.Content>
            <Message.Content>
                <Mutation
                    mutation={POST_RESPONSE_LIKE_MUTATION}
                    variables={{ responseId: id}}
                    update={(store, { data: { postResponseLike } }) => {
                        _updateStoreAfterAddingReaction(store, postResponseLike);
                    }}
                >
                    {postMutation => 
                        <Label basic size="small" as="a" onClick={postMutation}> 
                            <Icon name="thumbs up" />
                            {likeCount}
                        </Label>
                    }
                </Mutation>
                <Mutation
                    mutation={POST_RESPONSE_DISLIKE_MUTATION}
                    variables={{ responseId: id}}
                    update={(store, { data: { postResponseDislike } }) => {
                        _updateStoreAfterAddingReaction(store, postResponseDislike);
                    }}
                >
                    {postMutation => 
                        <Label basic size="small" as="a" onClick={postMutation}>
                            <Icon name="thumbs down" />
                            {dislikeCount}
                        </Label>
                    }
                </Mutation>
            </Message.Content>
        </Message>
    );
}

export default Response;