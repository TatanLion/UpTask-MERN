import { Router } from "express";
import { body, param } from "express-validator";
// Middlewares
import { handleInputErrors } from "../middlewares/validation";
import { validateProjectExists } from "../middlewares/project";
import { authenticate } from "../middlewares/auth";
import { hasAuthorization, validateTaskBelongsToProject, validateTaskExists } from "../middlewares/task";
// Controllers
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router: Router = Router();

// Use authenticate middleware for all routes
router.use(authenticate);

// @IMPORTANT: Routes for Project
router.get('/', ProjectController.getAllProjects);

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.post('/',
    body('projectName').notEmpty().withMessage('Name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
);

router.put('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('projectName').notEmpty().withMessage('Name is required'),
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.updateProject
);

router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.deleteProject
);



// @IMPORTANT: Routes for Tasks
router.param('projectId', validateProjectExists); // Middleware to validate project existence, this it will run for any route with contains :projectId
router.param('taskId', validateTaskExists); // Middleware to validate taskId existence, this it will run for any route with contains :taskId
router.param('taskId', validateTaskBelongsToProject); // Middleware to validate that the task belongs to the project, that will run for any route with contains :taskId, and it will run after validateTaskExists because is declared after it

router.get('/:projectId/tasks',
    TaskController.getTasksByProject
);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.addTaskToProject
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status').notEmpty().withMessage('Task status is required'),
    handleInputErrors,
    TaskController.updateTaskStatus
)



// @IMPORTANT: Routes for Team
router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Email is not valid'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamController.removeMemberById
)

router.get('/:projectId/team',
    TeamController.getProjectTeam
)


// @IMPORTANT: Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Note content is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTasksNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid note ID'),
    handleInputErrors,
    NoteController.deleteNote
)



export default router;