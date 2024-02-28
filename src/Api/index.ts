import { App, Editor, MarkdownView, View } from 'obsidian';
import type { App, Editor, MarkdownFileInfo, MarkdownView, TFile } from 'obsidian';
import type { Task } from '../Task/Task';
import { taskFromLine } from '../Commands/CreateOrEditTaskParser';
import { createOrEdit, createOrEdit2, createOrEdit3 } from '../Commands/CreateOrEdit';
import { createTaskLineModal } from './createTaskLineModal';
import type { TasksApiV1 } from './TasksApiV1';
import { defaultTaskModalFactory } from './createTaskLineModalHelper';

/**
 * Factory method for API v1
 *
 * @param app - The Obsidian App
 */
export const tasksApiV1 = (app: App): TasksApiV1 => {
    return {
        createTaskLineModal: (): Promise<string> => {
            return createTaskLineModal(app, defaultTaskModalFactory);
        },

        editTaskLineModal: async (path: string, lineNumber: number): string => {
            console.log('editTaskLineModal(1) called');

            const tfilep = app.vault.getAbstractFileByPath(path);
            const leaf = app.workspace.getLeaf(false);
            leaf.openFile(tfilep);

            await new Promise((resolve) => setTimeout(resolve, 127));

            console.log(`going to line number: ${lineNumber}`);
            const neditor = app.workspace.activeEditor.editor;
            neditor.setCursor(lineNumber, 0);
            const nview = app.workspace.activeLeaf.view;

            const line = neditor.getLine(lineNumber);
            const task = taskFromLine({ line, path });
            console.log(`line: ${line}`);
            console.log(`task: ${JSON.stringify(task)}`);

            return await createOrEdit3(path, lineNumber, true, neditor, nview, app, []);
        },
    };
};
