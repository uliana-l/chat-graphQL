import React, {useState} from 'react';
import { Query } from 'react-apollo';
import { 
  MESSAGE_QUERY, 
  NEW_MESSAGES_SUBSCRIPTION, 
  MESSAGE_ACTION_SUBSCRIPTION,
  NEW_RESPONSES_SUBSCRIPTION,
  RESPONSE_ACTION_SUBSCRIPTION
} from '../../queries';
import MessageItem from './Message';
import MessageInput from '../MessageInput/MessageInput';
import { Header, Button, Input, Segment } from 'semantic-ui-react';

const MessageList = (props) => {
    const [orderBy, setOrder] = useState('createdAt_ASC');
    const [filter, setFilter] = useState('');
    const [value, setValue] = useState('');

    const _subscribeToNewMessages = subscribeToMore => {
        subscribeToMore({
          document: NEW_MESSAGES_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { newMessage } = subscriptionData.data;
            const exists = prev.messages.messageList.find(({ id }) => id === newMessage.id);
            if (exists) return prev;

            return {...prev, messages: {
              messageList: [...prev.messages.messageList, newMessage],
              count: prev.messages.messageList.length + 1,
              __typename: prev.messages.__typename
            }};
          }
        });
    };

    const _subscribeToNewMessageActions = subscribeToMore => {
      subscribeToMore({
        document: MESSAGE_ACTION_SUBSCRIPTION
      });
    };

    const _subscribeToNewResponseActions = subscribeToMore => {
      subscribeToMore({
        document: RESPONSE_ACTION_SUBSCRIPTION
      });
    };

    const _subscribeToNewResponse = subscribeToMore => {
      subscribeToMore({
        document: NEW_RESPONSES_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newResponse } = subscriptionData.data;
          const message = prev.messages.messageList.find(({ id }) => id === newResponse.message.id);
          const exists = message.responses.find(({ id }) => id === newResponse.id);
          if (exists) return prev;
          prev.messages.messageList = prev.messages.messageList.map(item => {
            if (item.id === newResponse.message.id) {
                item.responses.push(newResponse);
            }
           return item;
          });
          return prev;
        }
      });
    };

    const sortByLikes = () => {
      setOrder('likeCount_DESC');
    }

    const sortByDislikes = () => {
      setOrder('dislikeCount_DESC');
    }

    const sortByDate = () => {
      setOrder('createdAt_ASC');
    }

    const setFilterText = () => {
      setFilter(value);
    }

    const onInputChange = (e) => {
      setValue(e.target.value);
    }

    return (
        <div>
        <Query query={MESSAGE_QUERY} variables={{ orderBy, filter }}>
            {({ loading, error, data, subscribeToMore }) => {
              console.log('start')
                 if (loading) return <div>Loading...</div>;
                 if (error) return <div>Fetch error</div>;
                 _subscribeToNewMessages(subscribeToMore);
                 _subscribeToNewMessageActions(subscribeToMore);
                 _subscribeToNewResponse(subscribeToMore);
                 _subscribeToNewResponseActions(subscribeToMore);
                 const { messages: { messageList } } = data;
                 return (
                   <div>
                     <Segment clearing>
                    <Header floated="left">
                      <Button onClick={sortByDate}>
                        Sort by date
                      </Button>
                      <Button onClick={sortByLikes}>
                        Sort by likes
                      </Button>
                      <Button onClick={sortByDislikes}>
                        Sort by dislikes
                      </Button>
                    </Header>
                    <Header floated="right">
                      <span>
                      <Input placeholder='Search...' value={value} onChange={onInputChange} action>
                        <input />
                        <Button onClick={setFilterText}>Search</Button>
                      </Input> 
                      </span>
                    </Header>
                    </Segment>
                    <div className="message-list">
                      {messageList.map(item => {
                        return <MessageItem key={item.id} message={item}/>
                      })}
                    </div>
                    <br />
                    <br />
                    <MessageInput/>
                   </div>
                 );
            }}
        </Query>
        </div>
    )
}

export default MessageList;
