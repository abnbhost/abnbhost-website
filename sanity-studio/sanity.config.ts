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
    defineField({name: 'introTitle', title: 'Homepage introduction heading', type: 'string', hidden: ({document}) => document?.slug?.current !== 'home'}),
    defineField({name: 'seoDescription', title: 'Search description', type: 'text', rows: 2})
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

export default defineConfig({
  name: 'default',
  title: 'ABNBHost Content Studio',
  projectId: 'nvnz9p1u',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {types: [siteSettings, page, property, testimonial]}
})
