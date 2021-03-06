import { providerMap } from '../provider.map';
import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ShortcutRepository
} from '../repositories/contracts';
import { get } from 'lodash';
import { addShortcut } from '../Validator/addShortcut';
import { removeShortcut } from '../Validator/removeShortcut';
import { BaseValidator } from '@libs/core/validator';
import { ValidationFailed } from '@libs/core/exceptions'
import { HttpAdapterHost } from '@nestjs/core';
import { Meili } from '../utils'
require('dotenv').config();

interface Shortcut {
  description: string,
  tags: string[],
  _id: string,
  user: string,
  shortlink: string,
  url: string,
  createdAt: string,
  uodatedAt: string,
  __V: number;
}

@Injectable()
export class ShortcutService {
  constructor(
    private validator: BaseValidator,

    @Inject(providerMap.SHORTCUT_REPO)
    private Shortcuts: ShortcutRepository,
  ) {}

  /**
   * Fetch User Shortcuts
   * @param user 
   * @param inputs 
   * @returns 
   */
  async getUserShortcut(user: Record<string, any>, inputs: Record<string, any>): Promise<Record<string, any>> {
    if (inputs.search == '' || inputs.search == undefined) {
      const usershortcuts = await this.Shortcuts.getWhere({ user: user._id }, false);
      if (!usershortcuts) {
        throw new BadRequestException("User haven't created any shortcuts yet");
      }
      return usershortcuts;
    }else{
      const search = await Meili.searchShortcut<Shortcut>(inputs.search, user._id);
      return search;
    }
  }

  /**
   * Create User Shortcut
   * @param user 
   * @param inputs 
   * @returns 
   */
  async addShortcut(user:Record<string, any>,inputs: Record<string, any>): Promise<any> {
    await this.validator.fire(inputs, addShortcut);
    const shortcutData = await this.Shortcuts.create({
      user: user._id,
      shortlink: inputs.shortlink,
      url: inputs.url,
      description: inputs.description,
      tags: inputs.tags,
    });
    const newShortcutArray = [];
    newShortcutArray.push(shortcutData);
    await Meili.addShortcut(newShortcutArray); //Adding it to Meilisearch Index DB
    return shortcutData;

  }
/**
 * Remove a User Shortcut
 * @param user 
 * @param inputs 
 * @returns 
 */
  async removeShortcut(user: Record<string,any>,inputs: Record<string, any>): Promise<any> {
    await this.validator.fire(inputs, removeShortcut);
    const userShortcut = await this.Shortcuts.firstWhere({ user: user._id, _id: inputs.shortcutid });
    if(!userShortcut){
      throw new BadRequestException("No shortcut Exists with this ID");
    }
    const Shortcutremoval = await this.Shortcuts.deleteWhere({_id: inputs.shortcutid});
    await Meili.deleteShortcut(inputs.shortcutid); // Deleting it from MeilisearchDB
    return Shortcutremoval
  }
}
