import { $command, $ctx } from '@milkdown/utils'
import { imageSchema } from '@milkdown/preset-commonmark'
import { readImageAsBase64, uploadConfig, uploadPlugin } from '@milkdown/plugin-upload'
import type { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import type { Schema } from '@milkdown/prose/model'

export const remoteUploadConfig = $ctx(defaultCallback, 'remoteUploadConfig')

export const remoteUploadCommand = $command(
  'RemoteUpload',
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  ctx => files => async (state, dispatch) => {
    if (!dispatch)
      return true

    const images = await ctx.get(remoteUploadConfig.key)(files as FileList)
    if (!images.length)
      return true

    const { alt = '', src = '' } = (images.shift()) as { alt: string, src: string }// 取第一张图片信息

    const node = imageSchema.type(ctx).create({ src, alt })
    if (!node)
      return true

    dispatch(state.tr.replaceSelectionWith(node).scrollIntoView())
    return true
  },
)

async function defaultCallback(files: FileList) {
  const imgs: File[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (!file)
      continue

    if (!file.type.includes('image'))
      continue

    imgs.push(file)
  }

  return await Promise.all(imgs.map(img => readImageAsBase64(img)))
}

export function remoteUploader(ctx: Ctx) {
  return async (files: FileList, schema: Schema) => {
    const images = await ctx.get(remoteUploadConfig.key)(files)

    return images.map(({ src, alt }) => {
      return schema.nodes.image.createAndFill({
        src,
        alt,
      })
    })
  }
}

export const remoteUpload: MilkdownPlugin[] = [uploadPlugin, uploadConfig, remoteUploadCommand, remoteUploadConfig]
