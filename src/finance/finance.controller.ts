import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AnalysisSummaryDto,
  CategoryDto,
  CreateCategoryDto,
  CreateSavingsGoalDto,
  CreateSavingsToolDto,
  CreateTransactionDto,
  MonthlyReportDto,
  SavingsGoalDto,
  SavingsToolDto,
  TransactionDto,
  TransactionQueryDto,
  UpdateCategoryDto,
  UpdateSavingsGoalDto,
  UpdateSavingsToolDto,
  UpdateTransactionDto,
} from './dto/finance.dto';
import { FinanceService } from './finance.service';

@ApiTags('Finance')
@Controller('finance')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ========== CATEGORY ENDPOINTS ==========

  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createCategory(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.financeService.createCategory(req.user.id, createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories for the user' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by transaction type',
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCategories(@Request() req, @Query('type') type?: string) {
    return this.financeService.getCategories(req.user.id, type);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateCategory(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.financeService.updateCategory(
      req.user.id,
      id,
      updateCategoryDto,
    );
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteCategory(@Request() req, @Param('id') id: string) {
    return this.financeService.deleteCategory(req.user.id, id);
  }

  // ========== TRANSACTION ENDPOINTS ==========

  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createTransaction(
    @Request() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.financeService.createTransaction(
      req.user.id,
      createTransactionDto,
    );
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transactions with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getTransactions(@Request() req, @Query() query: TransactionQueryDto) {
    return this.financeService.getTransactions(req.user.id, query);
  }

  @Put('transactions/:id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
    type: TransactionDto,
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateTransaction(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.financeService.updateTransaction(
      req.user.id,
      id,
      updateTransactionDto,
    );
  }

  @Delete('transactions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteTransaction(@Request() req, @Param('id') id: string) {
    return this.financeService.deleteTransaction(req.user.id, id);
  }

  // ========== SAVINGS GOAL ENDPOINTS ==========

  @Post('savings-goals')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new savings goal' })
  @ApiResponse({
    status: 201,
    description: 'Savings goal created successfully',
    type: SavingsGoalDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createSavingsGoal(
    @Request() req,
    @Body() createGoalDto: CreateSavingsGoalDto,
  ) {
    return this.financeService.createSavingsGoal(req.user.id, createGoalDto);
  }

  @Get('savings-goals')
  @ApiOperation({ summary: 'Get all savings goals for the user' })
  @ApiResponse({
    status: 200,
    description: 'Savings goals retrieved successfully',
    type: [SavingsGoalDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getSavingsGoals(@Request() req) {
    return this.financeService.getSavingsGoals(req.user.id);
  }

  @Put('savings-goals/:id')
  @ApiOperation({ summary: 'Update a savings goal' })
  @ApiResponse({
    status: 200,
    description: 'Savings goal updated successfully',
    type: SavingsGoalDto,
  })
  @ApiNotFoundResponse({ description: 'Savings goal not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateSavingsGoal(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateSavingsGoalDto,
  ) {
    return this.financeService.updateSavingsGoal(
      req.user.id,
      id,
      updateGoalDto,
    );
  }

  @Delete('savings-goals/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a savings goal' })
  @ApiResponse({
    status: 204,
    description: 'Savings goal deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Savings goal not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteSavingsGoal(@Request() req, @Param('id') id: string) {
    return this.financeService.deleteSavingsGoal(req.user.id, id);
  }

  // ========== SAVINGS TOOL ENDPOINTS ==========

  @Post('savings-tools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new savings tool' })
  @ApiResponse({
    status: 201,
    description: 'Savings tool created successfully',
    type: SavingsToolDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createSavingsTool(
    @Request() req,
    @Body() createToolDto: CreateSavingsToolDto,
  ) {
    return this.financeService.createSavingsTool(req.user.id, createToolDto);
  }

  @Get('savings-tools')
  @ApiOperation({ summary: 'Get all savings tools for the user' })
  @ApiResponse({
    status: 200,
    description: 'Savings tools retrieved successfully',
    type: [SavingsToolDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getSavingsTools(@Request() req) {
    return this.financeService.getSavingsTools(req.user.id);
  }

  @Put('savings-tools/:id')
  @ApiOperation({ summary: 'Update a savings tool' })
  @ApiResponse({
    status: 200,
    description: 'Savings tool updated successfully',
    type: SavingsToolDto,
  })
  @ApiNotFoundResponse({ description: 'Savings tool not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateSavingsTool(
    @Request() req,
    @Param('id') id: string,
    @Body() updateToolDto: UpdateSavingsToolDto,
  ) {
    return this.financeService.updateSavingsTool(
      req.user.id,
      id,
      updateToolDto,
    );
  }

  @Delete('savings-tools/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a savings tool' })
  @ApiResponse({
    status: 204,
    description: 'Savings tool deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Savings tool not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteSavingsTool(@Request() req, @Param('id') id: string) {
    return this.financeService.deleteSavingsTool(req.user.id, id);
  }

  // ========== ANALYSIS ENDPOINTS ==========

  @Get('analysis/summary')
  @ApiOperation({ summary: 'Get financial analysis summary' })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'Start date for analysis',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'End date for analysis',
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis summary retrieved successfully',
    type: AnalysisSummaryDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAnalysisSummary(
    @Request() req,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return this.financeService.getAnalysisSummary(
      req.user.id,
      startDate,
      endDate,
    );
  }

  @Get('analysis/monthly-report/:year/:month')
  @ApiOperation({ summary: 'Get monthly report' })
  @ApiResponse({
    status: 200,
    description: 'Monthly report retrieved successfully',
    type: MonthlyReportDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getMonthlyReport(
    @Request() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.financeService.getMonthlyReport(
      req.user.id,
      parseInt(year),
      parseInt(month),
    );
  }
}
