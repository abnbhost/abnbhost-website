import {defineConfig, defineField, defineType} from 'sanity'
import {structureTool} from 'sanity/structure'

const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({name: 'siteName', title: 'Business name', type: 'string', initialValue: 'ABNBHost'}),
    defineField({name: 'email', title: 'Inquiry email', type: 'string'}),
    defineField({name: 'whatsapp', title: 'WhatsApp number', type: 'string'}),
    defineField({name: 'instagram', title: 'Instagram username', type: 'string'}),
    defineField({name: 'youtube', title: 'YouTube username', type: 'string'}),
    defineField({name: 'formRecipientEmail', title: 'Contact form recipient email', type: 'string'}),
    defineField({name: 'headingScale', title: 'Heading size', type: 'string', options: {list: [{title: 'Compact', value: 'compact'}, {title: 'Standard', value: 'standard'}, {title: 'Large', value: 'large'}]}, initialValue: 'standard'}),
    defineField({name: 'bodyScale', title: 'Body text size', type: 'string', options: {list: [{title: 'Compact', value: 'compact'}, {title: 'Standard', value: 'standard'}, {title: 'Large', value: 'large'}]}, initialValue: 'standard'}),
    defineField({name: 'metrics', title: 'Headline metrics', type: 'array', of: [{type: 'object', fields: [defineField({name: 'value', title: 'Value', type: 'string'}), defineField({name: 'label', title: 'Label', type: 'string'})]}]}),
    defineField({name: 'locations', title: 'Service locations', type: 'array', of: [{type: 'string'}]})
  ], preview: {prepare: () => ({title: 'ABNBHost site settings'})}
})

const page = defineType({
  name: 'page', title: 'Website page', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Page', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (rule) => rule.required()}),
    defineField({name: 'heroTitle', title: 'Main heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'heroDescription', title: 'Heading description', type: 'text', rows: 3}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'introTitle', title: 'Homepage introduction heading', type: 'string', hidden: ({document}) => document?.slug?.current !== 'home'}),
    defineField({name: 'seoDescription', title: 'Search description', type: 'text', rows: 2}),
    defineField({
      name: 'sections', title: 'Page sections', type: 'array', of: [{type: 'object', fields: [
        defineField({name: 'key', title: 'Section key', type: 'string', description: 'Use a short identifier such as story, mission, system or comparison.'}),
        defineField({name: 'label', title: 'Section label', type: 'string'}),
        defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
        defineField({name: 'heading', title: 'Section heading', type: 'string'}),
        defineField({name: 'body', title: 'Section description', type: 'text', rows: 4}),
        defineField({name: 'image', title: 'Section image', type: 'image', options: {hotspot: true}}),
        defineField({name: 'buttonLabel', title: 'Button label', type: 'string'}),
        defineField({name: 'buttonLink', title: 'Button link', type: 'string'}),
        defineField({name: 'items', title: 'Cards, points, or paragraphs', type: 'array', of: [{type: 'object', fields: [
          defineField({name: 'label', title: 'Small label / number', type: 'string'}),
          defineField({name: 'title', title: 'Title', type: 'string'}),
          defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}})
        ]}]})
      ]}]
    })
  ], preview: {select: {title: 'title', subtitle: 'slug.current'}}
})

const property = defineType({
  name: 'property', title: 'Property', type: 'document',
  fields: [
    defineField({name: 'name', title: 'Property name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string', initialValue: 'Jaipur'}),
    defineField({name: 'type', title: 'Property type', type: 'string'}),
    defineField({name: 'image', title: 'Property image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'featured', title: 'Show on homepage', type: 'boolean', initialValue: true}),
    defineField({name: 'sortOrder', title: 'Display order', type: 'number', initialValue: 10})
  ], preview: {select: {title: 'name', subtitle: 'location', media: 'image'}}
})

const testimonial = defineType({
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    defineField({name: 'name', title: 'Owner name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string', initialValue: 'Jaipur'}),
    defineField({name: 'quote', title: 'Testimonial', type: 'text', rows: 5, validation: (rule) => rule.required()}),
    defineField({name: 'featured', title: 'Show on website', type: 'boolean', initialValue: true})
  ], preview: {select: {title: 'name', subtitle: 'location'}}
})

const service = defineType({
  name: 'service', title: 'Service', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Service name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'summary', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Service image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'sortOrder', title: 'Display order', type: 'number', initialValue: 10}),
    defineField({name: 'showOnHome', title: 'Show on homepage', type: 'boolean', initialValue: true})
  ], preview: {select: {title: 'title', subtitle: 'summary', media: 'image'}}
})

const insight = defineType({
  name: 'insight', title: 'Insight / article', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Article title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'category', title: 'Category and reading time', type: 'string'}),
    defineField({name: 'summary', title: 'Short summary', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Article image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'featured', title: 'Featured article', type: 'boolean', initialValue: false}),
    defineField({name: 'sortOrder', title: 'Display order', type: 'number', initialValue: 10})
  ], preview: {select: {title: 'title', subtitle: 'category', media: 'image'}}
})

export default defineConfig({
  name: 'default',
  title: 'ABNBHost Content Studio',
  projectId: 'nvnz9p1u',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {types: [siteSettings, page, property, testimonial, service, insight]}
})
