import { extendType, objectType, nonNull, stringArg, intArg } from 'nexus'

export const Feature = objectType({
  name: 'Feature',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.int('width')
    t.nonNull.int('height')
    t.nonNull.list.nonNull.field('controls', {
      type: 'Control',
      resolve (parent, _, context) {
        return context.prisma.control.findMany({
          where: { featureId: parent.id }
        })
      }
    })
    t.id('partId')
    t.nonNull.field('part', {
      // 1
      type: 'Part',
      resolve (parent, _, context) {
        // 2
        return context.prisma.part.findUnique({ where: { id: parent.partId } })
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
        width: nonNull(intArg()),
        height: nonNull(intArg()),
        partId: nonNull(stringArg())
      },

      resolve (parent, args, context) {
        return context.prisma.feature.create({
          data: {
            name: args.name,
            width: args.width,
            height: args.height,
            part: { connect: { id: args.partId } }
          }
        })
      }
    })
  }
})
