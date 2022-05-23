import {
  extendType,
  objectType,
  nonNull,
  nullable,
  stringArg,
  intArg,
  floatArg,
  subscriptionField
} from 'nexus'

import { updateLast, getQuality, getWorstQuality } from './utils'

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

export const Control = objectType({
  name: 'Control',
  definition (t) {
    t.id('id')
    t.nonNull.string('name')
    t.nonNull.int('order')
    t.nonNull.float('nominal')
    t.nonNull.float('dev1')
    t.nonNull.float('dev2')
    t.nullable.float('value')
    t.nullable.string('lasts')
    t.nullable.string('quality')

    t.id('featureId')
    t.field('feature', {
      type: 'Feature',
      resolve (parent, _, context) {
        return context.prisma.feature.findUnique({
          where: { id: parent.featureId }
        })
      }
    })
  }
})

export const ControlQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nonNull.list.nonNull.field('controls', {
      type: 'Control',
      resolve (_, __, context) {
        return context.prisma.control.findMany()
      }
    })
  }
})

export const ControlMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addControl', {
      type: 'Control',
      args: {
        name: nonNull(stringArg()),
        order: nonNull(intArg()),
        nominal: nonNull(floatArg()),
        dev1: nonNull(floatArg()),
        dev2: nonNull(floatArg()),
        featureId: nonNull(stringArg())
      },

      resolve (_, args, context) {
        const newControl = context.prisma.control.create({
          data: {
            name: args.name,
            order: args.order,
            nominal: args.nominal,
            dev1: args.dev1,
            dev2: args.dev2,
            feature: { connect: { id: args.featureId } }
          }
        })

        pubsub.publish('addedControl', {
          control: newControl
        })

        return newControl
      }
    })
  }
})

export const ValueMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('addValue', {
      type: 'Control',
      args: {
        id: nonNull(stringArg()),
        value: nullable(floatArg())
      },

      async resolve (_, args, context) {
        const control = await context.prisma.control.findUnique({
          where: { id: args.id }
        })

        const newValue = args.value ?? null
        const newLasts = updateLast(control?.lasts || '[]', newValue)
        const quality = getQuality(control, newValue)

        const newControl = await context.prisma.control.update({
          where: {
            id: args.id
          },
          data: {
            value: newValue,
            lasts: newLasts,
            quality
          }
        })

        const feature = await context.prisma.feature.findUnique({
          where: { id: control?.featureId }
        })

        const controls = await context.prisma.control.findMany({
          where: { featureId: control?.featureId }
        })

        const newFeatureQuality = getWorstQuality(controls)

        if (newFeatureQuality !== feature?.quality) {
          await context.prisma.feature.update({
            where: {
              id: feature?.id
            },
            data: {
              quality: newFeatureQuality
            }
          })
        }

        pubsub.publish('updatedControl', {
          control: newControl
        })

        return newControl
      }
    })
  }
})

export const SubscriptionUpdateControl = subscriptionField('updatedControl', {
  type: 'Control',
  subscribe () {
    return pubsub.asyncIterator(['updatedControl'])
  },

  resolve (eventData) {
    return eventData.control
  }
})

export const SubscriptionAddControl = subscriptionField('addedControl', {
  type: 'Control',
  subscribe () {
    return pubsub.asyncIterator(['addedControl'])
  },

  resolve (eventData) {
    return eventData.control
  }
})
