const postMessage = (parent, args, context) => {
    return context.prisma.createMessage({
        text: args.text,
        likeCount: 0,
        dislikeCount: 0
    })
};

const postResponse = async (parent, args, context, info) => {
    const messageExists = await context.prisma.$exists.message({
      id: args.messageId
    });
  
    if (!messageExists) {
      throw new Error(`Message with ID ${args.messageId} does not exist`);
    }
  
    return context.prisma.createResponse({
      text: args.text,
      likeCount: 0,
      dislikeCount: 0,
      message: { connect: { id: args.messageId } }
    });
}

const postMessageLike = async (parent, args, context, info) => {
  const message = await context.prisma.message({
    id: args.messageId
  });
  if (!message) {
    throw new Error(`Message with ID ${args.messageId} does not exist`);
  }
  return context.prisma.updateMessage({
    where: { id: args.messageId },
    data: { likeCount: message.likeCount + 1 }
  });
}

const postMessageDislike = async (parent, args, context, info) => {
  const message = await context.prisma.message({
    id: args.messageId
  });
  if (!message) {
    throw new Error(`Message with ID ${args.messageId} does not exist`);
  }
  return context.prisma.updateMessage({
    where: { id: args.messageId },
    data: { dislikeCount: message.dislikeCount + 1 }
  });
}

const postResponseLike = async (parent, args, context, info) => {
  const response = await context.prisma.response({
    id: args.responseId
  });
  if (!response) {
    throw new Error(`Response with ID ${args.responseId} does not exist`);
  }
  return context.prisma.updateResponse({
    where: { id: args.responseId },
    data: { likeCount: response.likeCount + 1 }
  });
}

const postResponseDislike = async (parent, args, context, info) => {
  const response = await context.prisma.response({
    id: args.responseId
  });
  if (!response) {
    throw new Error(`Response with ID ${args.responseId} does not exist`);
  }
  return context.prisma.updateResponse({
    where: { id: args.responseId },
    data: { dislikeCount: response.dislikeCount + 1 }
  });
}

module.exports = { 
    postMessage,
    postResponse,
    postMessageLike,
    postMessageDislike,
    postResponseLike,
    postResponseDislike
};