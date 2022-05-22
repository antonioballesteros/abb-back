import {
  extendType,
  objectType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  floatArg,
} from 'nexus'

import { updateLast } from './utils'

export const Control = objectType({
  name: 'Control',
  definition(t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.int('order')
    t.nonNull.float('nominal')
    t.nonNull.float('dev1')
    t.nonNull.float('dev2')
    t.nullable.float('value')
    t.nullable.string('lasts')

    t.id('featureId')
    t.field('feature', {
      type: 'Feature',
      resolve(parent, _, context) {
        return context.prisma.feature.findUnique({
          where: { id: parent.featureId },
        })
      },
    })
  },
})

export const ControlQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('controls', {
      type: 'Control',
      resolve(_, __, context) {
        return context.prisma.control.findMany()
      },
    })
  },
})

export const ControlMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('addControl', {
      type: 'Control',
      args: {
        name: nonNull(stringArg()),
        order: nonNull(intArg()),
        nominal: nonNull(floatArg()),
        dev1: nonNull(floatArg()),
        dev2: nonNull(floatArg()),
        featureId: nonNull(stringArg()),
      },

      resolve(_, args, context) {
        const newControl = context.prisma.control.create({
          data: {
            name: args.name,
            order: args.order,
            nominal: args.nominal,
            dev1: args.dev1,
            dev2: args.dev2,
            feature: { connect: { id: args.featureId } },
          },
        })
        return newControl
      },
    })
  },
})

export const ValueMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('addValue', {
      type: 'Control',
      args: {
        id: nonNull(stringArg()),
        value: nullable(floatArg()),
      },

      async resolve(_, args, context) {
        console.log('args', args)
        const control = await context.prisma.control.findUnique({
          where: { id: args.id },
        })

        const newValue = args.value ?? null
        const newLasts = updateLast(control?.lasts || '[]', newValue)

        const newControl = await context.prisma.control.update({
          where: {
            id: args.id,
          },
          data: {
            value: newValue,
            lasts: newLasts,
          },
        })

        return newControl
      },
    })
  },
})
