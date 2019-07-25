const newMessageSubscribe = (parent, args, context, info) => {
    return context.prisma.$subscribe.message({
        mutation_in: ['CREATED']
    }).node();
}

const newResponseSubscribe = (parent, args, context, info) => {
    return context.prisma.$subscribe.response({
        mutation_in: ['CREATED']
    }).node();
}

const newMessageActionSubscribe = (parent, args, context, info) => {
    return context.prisma.$subscribe.message({
        mutation_in: ['UPDATED']
    }).node();
}

const newResponseActionSubscribe = (parent, args, context, info) => {
    return context.prisma.$subscribe.response({
        mutation_in: ['UPDATED']
    }).node();
}

const newMessage = {
    subscribe: newMessageSubscribe,
    resolve: payload => {
        return payload;
    }
};

const newResponse = {
    subscribe: newResponseSubscribe,
    resolve: payload => {
        return payload;
    }
};

const newMessageAction = {
    subscribe: newMessageActionSubscribe,
    resolve: payload => {
        return payload;
    }
};

const newResponseAction = {
    subscribe: newResponseActionSubscribe,
    resolve: payload => {
        return payload;
    }
};



module.exports = {
    newMessage,
    newResponse,
    newMessageAction,
    newResponseAction
};