import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Form, Grid, TextArea, Button } from 'semantic-ui-react';
import { POST_RESPONSE_MUTATION, MESSAGE_QUERY } from '../../queries';

const ResponseInput = (props) => {
    const [ value, setValue ] = useState('');

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const _updateStoreAfterAddingResponse = (store, newResponse) => {
        const orderBy = 'createdAt_DESC';
        const data = store.readQuery({
          query: MESSAGE_QUERY,
          variables: {
            orderBy,
            filter: '',
            skip: props.skip,
            first: 6
          }
        });
        
        data.messages.messageList = data.messages.messageList.map(item => {
            if (item.id === newResponse.message.id) {
                item.responses.push(newResponse);
            }
           return item;
        });

        store.writeQuery({
          query: MESSAGE_QUERY,
          data
        });

        setValue('');
    }

    return (
        <Form>
            <Button icon="close" onClick={props.showInput} /> 
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
                        mutation={POST_RESPONSE_MUTATION}
                        variables={{ messageId: props.id, text: value}}
                        update={(store, { data: { postResponse } }) => {
                            _updateStoreAfterAddingResponse(store, postResponse);
                        }}
                        onCompleted={props.showInput}
                    >
                        
                        {postMutation => 
                            <Button onClick={() => {
                                if (value.trim() !== '')
                                postMutation();
                            }}>
                                Send response
                            </Button>
                        }
                    </Mutation>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    )
}

export default ResponseInput;