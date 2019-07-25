import React, { useState } from 'react';
import { TextArea, Button, Grid, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { POST_MESSAGE_MUTATION, MESSAGE_QUERY } from '../../queries';

const MessageInput = (props) => {
    const [ value, setValue ] = useState('');

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const _updateStoreAfterAddingMessage = (store, newMessage) => {
        const orderBy = 'createdAt_DESC';
        const data = store.readQuery({
          query: MESSAGE_QUERY,
          variables: {
            orderBy,
            filter: '',
            skip: 0,
            first: 6
          }
        });
        data.messages.messageList.unshift(newMessage);
        data.messages.count += 1;
        store.writeQuery({
          query: MESSAGE_QUERY,
          data
        });
    };

    return (
        <Form>
            <Grid>
                <Grid.Row centered columns="2">
                    <Grid.Column width="5">
                        <TextArea 
                            placeholder="enter your message" 
                            value={value} 
                            onChange={onChange}
                        />
                    </Grid.Column>
                    <Grid.Column width="1">
                    <Mutation
                                mutation={POST_MESSAGE_MUTATION}
                                variables={{ text: value}}
                                update={(store, { data: { postMessage } }) => {
                                    _updateStoreAfterAddingMessage(store, postMessage);
                                }}
                                onCompleted={() => {setValue('');}}
                            >
                                {postMutation => 
                                    <Button onClick={() => {
                                        if (value.trim() !== '')
                                        postMutation();
                                    }}>
                                        Send message
                                    </Button>
                                }
                            </Mutation>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    )
} 

export default MessageInput;