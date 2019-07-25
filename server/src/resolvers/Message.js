const responses = (parent, args, context) => {
    return context.prisma.message({
        id: parent.id
    }).responses();
}

module.exports = {
    responses
}