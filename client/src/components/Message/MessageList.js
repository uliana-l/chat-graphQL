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
import { Header, Button, Input, Segment, Pagination } from 'semantic-ui-react';

const MessageList = (props) => {
    const [orderBy, setOrder] = useState('createdAt_DESC');
    const [filter, setFilter] = useState('');
    const [value, setValue] = useState('');
    const [skip, setSkip] = useState(0);
    const [activePage, setActivePage] = useState(1);

    const _subscribeToNewMessages = subscribeToMore => {
        subscribeToMore({
          document: NEW_MESSAGES_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { newMessage } = subscriptionData.data;
            const exists = prev.messages.messageList.find(({ id }) => id === newMessage.id);
            if (exists) return prev;

            return {...prev, messages: {
              messageList: [newMessage, ...prev.messages.messageList],
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
      setOrder('createdAt_DESC');
    }

    const setFilterText = () => {
      setFilter(value);
    }

    const onInputChange = (e) => {
      setValue(e.target.value);
    }

    const onPageChange = (event, { activePage }) => {
      setSkip((activePage - 1) * 6);
      setActivePage(activePage);
    }

    const goTo = () => {
      props.history.push('/');
    }

    return (
        <div>
        <Query query={MESSAGE_QUERY} variables={{ orderBy, filter, skip, first: 6 }}>
            {({ loading, error, data, subscribeToMore }) => {
                 if (loading) return <div>Loading...</div>;
                 if (error) return <div>Fetch error</div>;
                 _subscribeToNewMessages(subscribeToMore);
                 _subscribeToNewMessageActions(subscribeToMore);
                 _subscribeToNewResponse(subscribeToMore);
                 _subscribeToNewResponseActions(subscribeToMore);
                 const { messages: { messageList, count } } = data;
                 const totalPages = Math.ceil(Number(count) / 6);
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
                    <div>
                      {messageList.map(item => {
                        return <MessageItem key={item.id} skip={skip} message={item}/>
                      })}
                    </div>
                    <br />
                    <br />
                    {activePage===1 && <MessageInput goTo={goTo} />}
                    <Pagination
                            defaultActivePage={1}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            siblingRange={3}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                    />
                  </div>
                 );
            }}
        </Query>
        </div>
    )
}

export default MessageList;
