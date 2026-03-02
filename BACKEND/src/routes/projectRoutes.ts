import { Router } from "express";
import { body, param } from "express-validator";
// Middlewares
import { handleInputErrors } from "../middlewares/validation";
import { validateProjectExists } from "../middlewares/project";
// Controllers
import { ProjectController } from "../controllers/ProjectController";
import { TaskController } from "../controllers/TaskController";
import { validateTaskBelongsToProject, validateTaskExists } from "../middlewares/task";

const router : Router = Router();

// @IMPORTANT: Routes for Project
router.get('/', ProjectController.getAllProjects );

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

router.param('projectId', validateProjectExists); // Middleware to validate project existence that will run for any route with contains :projectId

router.param('taskId', validateTaskExists); // Middleware to validate taskId existence that will run for any route with contains :taskId
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
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.addTaskToProject
);

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('Task name is required'),
    body('description').notEmpty().withMessage('Task description is required'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
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




export default router;