import { extendType, objectType, nonNull, stringArg } from 'nexus'

export const Part = objectType({
  name: 'Part',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.list.nonNull.field('layouts', {
      type: 'Layout',
      resolve (parent, _, context) {
        return context.prisma.layout.findMany({ where: { partId: parent.id } })
      }
    })
  }
})

export const PartsQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nonNull.list.nonNull.field('parts', {
      type: 'Part',
      resolve (_, __, context) {
        return context.prisma.part.findMany()
      }
    })
  }
})

export const GetPartQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nullable.field('getPart', {
      type: 'Part',
      args: {
        id: nonNull(stringArg())
      },
      resolve (_, args, context) {
        return context.prisma.part.findUnique({ where: { id: args.id } })
      }
    })
  }
})

export const PartMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addPart', {
      type: 'Part',
      args: {
        name: nonNull(stringArg())
      },

      resolve (_, args, context) {
        return context.prisma.part.create({
          data: {
            name: args.name
          }
        })
      }
    })
  }
})
