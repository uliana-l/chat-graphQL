import React, { useState } from 'react';
import Response from '../Response/Response';
import ResponseInput from '../Response/ResponseInput';
import { Message, Grid, Label, Icon, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { 
    POST_MESSAGE_DISLIKE_MUTATION, 
    POST_MESSAGE_LIKE_MUTATION, 
    MESSAGE_QUERY
} from '../../queries';

const MessageItem = ({ message, skip }) => {
    const { id, text, likeCount, dislikeCount, responses } = message;
    const [ isShown, setIsShown ] = useState(false);

    const showInput = () => {
        setIsShown(!isShown);
      }

    const _updateStoreAfterAddingReaction = (store, updatedMessage) => {
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
      
      if (updatedMessage.likeCount) {
        data.messages.messageList = data.messages.messageList.map(item => {
            return item.id === updatedMessage.id ? { ...item, likeCount: updatedMessage.likeCount } : item;
        });
      } else {
        data.messages.messageList = data.messages.messageList.map(item => {
            return item.id === updatedMessage.id ? { ...item, dislikeCount: updatedMessage.dislikeCount } : item;
        });
      }
      
      store.writeQuery({
        query: MESSAGE_QUERY,
        data
      });
    };

    return (
        <Grid columns="2">
            <Grid.Row>
                <Grid.Column>
                    <Message size="small">
                        <Message.Header>
                            #{id.slice(-3)}
                        </Message.Header>
                        <Message.Content>
                            {text}
                        </Message.Content>
                        <Message.Content>
                            <Mutation
                                mutation={POST_MESSAGE_LIKE_MUTATION}
                                variables={{ messageId: id}}
                                update={(store, { data: { postMessageLike } }) => {
                                    _updateStoreAfterAddingReaction(store, postMessageLike);
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
                                mutation={POST_MESSAGE_DISLIKE_MUTATION}
                                variables={{ messageId: id}}
                                update={(store, { data: { postMessageDislike } }) => {
                                    _updateStoreAfterAddingReaction(store, postMessageDislike);
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
                </Grid.Column>
                <Grid.Column>
                    {!isShown && <Button positive onClick={showInput}>
                        Add response
                    </Button>}
                    {isShown && <ResponseInput id={id} skip={skip} showInput={showInput}/>}
                    <br />
                    <br />
                    <br />
                    {responses.map(item => {
                        return (
                            <Response key={item.id} skip={skip} response={item} />
                        );
                    })}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default MessageItem;