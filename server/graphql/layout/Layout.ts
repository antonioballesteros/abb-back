import { extendType, objectType, nonNull, stringArg, intArg } from 'nexus'

export const Layout = objectType({
  name: 'Layout',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.int('size')
    t.nonNull.list.nonNull.field('features', {
      type: 'Feature',
      resolve (parent, _, context) {
        return context.prisma.feature.findMany({
          where: { layoutId: parent.id }
        })
      }
    })
    t.id('partId')
    t.nonNull.field('part', {
      // 1
      type: 'Part',
      resolve (parent, _, context) {
        return context.prisma.part.findUnique({ where: { id: parent.partId } })
      }
    })
  }
})

export const LayoutQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nonNull.list.nonNull.field('layouts', {
      type: 'Layout',
      resolve (_, __, context) {
        return context.prisma.layout.findMany()
      }
    })
  }
})

export const LayoutMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addLayout', {
      type: 'Layout',
      args: {
        name: nonNull(stringArg()),
        size: nonNull(intArg()),
        partId: nonNull(stringArg())
      },

      resolve (parent, args, context) {
        return context.prisma.layout.create({
          data: {
            name: args.name,
            size: args.size,
            part: { connect: { id: args.partId } }
          }
        })
      }
    })
  }
})
