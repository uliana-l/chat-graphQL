const message = (parent, args, context) => {
    return context.prisma.response({
        id: parent.id
    }).message();
}

module.exports = {
    message
}