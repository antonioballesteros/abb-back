import { extendType, objectType, nonNull, stringArg, intArg } from 'nexus'

export const Feature = objectType({
  name: 'Feature',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.list.nonNull.field('controls', {
      type: 'Control',
      resolve (parent, _, context) {
        return context.prisma.control.findMany({
          where: { featureId: parent.id }
        })
      }
    })
    t.id('layoutId')
    t.nonNull.field('layout', {
      // 1
      type: 'Layout',
      resolve (parent, _, context) {
        return context.prisma.layout.findUnique({ where: { id: parent.layoutId } })
      }
    })
  }
})

export const FeatureQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nonNull.list.nonNull.field('features', {
      type: 'Feature',
      resolve (_, __, context) {
        return context.prisma.feature.findMany()
      }
    })
  }
})

export const FeatureMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addFeature', {
      type: 'Feature',
      args: {
        name: nonNull(stringArg()),
        layoutId: nonNull(stringArg())
      },

      resolve (parent, args, context) {
        return context.prisma.feature.create({
          data: {
            name: args.name,
            layout: { connect: { id: args.layoutId } }
          }
        })
      }
    })
  }
})
