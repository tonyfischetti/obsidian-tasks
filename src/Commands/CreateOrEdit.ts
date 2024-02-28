import { App, Editor, MarkdownView, View } from 'obsidian';
import { TaskModal } from '../Obsidian/TaskModal';
import type { Task } from '../Task/Task';
import { DateFallback } from '../Task/DateFallback';
import { taskFromLine } from './CreateOrEditTaskParser';

export const createOrEdit = (checking: boolean, editor: Editor, view: View, app: App, allTasks: Task[]) => {
    // console.log(`========================`);
    // console.log(`checking: ${checking}`);
    if (checking) {
        return view instanceof MarkdownView;
    }

    // /* TODO: put back
    if (!(view instanceof MarkdownView)) {
        // Should never happen due to check above.
        // console.log(`should never happen`);
        return;
    }
    // */

    const path = view.file?.path;
    if (path === undefined) {
        // console.log(`undefined path :(`);
        return;
    }

    const cursorPosition = editor.getCursor();
    const lineNumber = cursorPosition.line;
    const line = editor.getLine(lineNumber);
    const task = taskFromLine({ line, path });
    // console.log(`cursor position: ${JSON.stringify(cursorPosition)}`);
    // console.log(`lineNumber: ${lineNumber}`);
    // console.log(`line: ${line}`);
    // console.log(`path: ${path}`);
    // console.log(`task: ${JSON.stringify(task)}`);

    const onSubmit = (updatedTasks: Task[]): void => {
        const serialized = DateFallback.removeInferredStatusIfNeeded(task, updatedTasks)
            .map((task: Task) => task.toFileLineString())
            .join('\n');
        console.log('SUBMITTED!');
        editor.setLine(lineNumber, serialized);
    };

    // Need to create a new instance every time, as cursor/task can change.
    const taskModal = new TaskModal({
        app,
        task,
        onSubmit,
        allTasks,
    });

    console.log('ABOUT TO OPEN MODAL!');
    taskModal.open();
};

export const createOrEdit3 = (
    path: string,
    lineNumber: number,
    checking: boolean,
    editor: Editor,
    view: View,
    app: App,
    allTasks: Task[],
): Promise<string> => {
    console.log('createOrEdit3 called');
    // console.log(`========================`);
    // console.log(`checking: ${checking}`);
    // if (checking) {
    //     return view instanceof MarkdownView;
    // }
    //
    // // /* TODO: put back
    // if (!(view instanceof MarkdownView)) {
    //     // Should never happen due to check above.
    //     // console.log(`should never happen`);
    //     return;
    // }
    // // */
    //
    // const path = view.file?.path;
    // if (path === undefined) {
    //     // console.log(`undefined path :(`);
    //     return;
    // }
    console.log('made it here');

    const cursorPosition = editor.getCursor();
    const lineNumber2 = cursorPosition.line;
    const line = editor.getLine(lineNumber2);
    const task = taskFromLine({ line, path });
    console.log(`cursor position: ${JSON.stringify(cursorPosition)}`);
    console.log(`lineNumber: ${lineNumber2}`);
    console.log(`line: ${line}`);
    console.log(`path: ${path}`);
    console.log(`!task: ${JSON.stringify(task)}`);

    let resolvePromise: (input: string) => void;
    const waitForClose = new Promise<string>((resolve, _) => {
        resolvePromise = resolve;
    });

    const onSubmit = (updatedTasks: Task[]): void => {
        const serialized = DateFallback.removeInferredStatusIfNeeded(task, updatedTasks)
            .map((task: Task) => task.toFileLineString())
            .join('\n');
        console.log(`returning: ${serialized}`);
        editor.setLine(lineNumber2, serialized);
        resolvePromise(serialized);
    };

    // Need to create a new instance every time, as cursor/task can change.
    const taskModal = new TaskModal({
        app,
        task,
        onSubmit,
        allTasks,
    });

    console.log('ABOUT TO OPEN MODAL!');
    taskModal.open();
    return waitForClose;
};
