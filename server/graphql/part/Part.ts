import { extendType, objectType, nonNull, stringArg } from 'nexus'

export const Part = objectType({
  name: 'Part',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.list.nonNull.field('features', {
      type: 'Feature',
      resolve (parent, _, context) {
        return context.prisma.feature.findMany({ where: { partId: parent.id } })
      }
    })
  }
})

export const PartQuery = extendType({
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

export const PartMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addPart', {
      type: 'Part',
      args: {
        name: nonNull(stringArg())
      },

      resolve (_, args, context) {
        const newPart = context.prisma.part.create({
          data: {
            name: args.name
          }
        })
        return newPart
      }
    })
  }
})
