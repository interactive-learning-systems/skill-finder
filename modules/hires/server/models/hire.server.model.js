'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* Question Schema
*/
var QuestionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  question: {
    type: String,
    default: '',
    trim: true,
    required: 'Question cannot be blank'
  },
  hint: {
    type: String,
    default: '',
    trim: true
  },
  module: {
    type: String,
    default: '',
    trim: true,
    required: 'Module cannot be blank'
  },
  unit: {
    type: String,
    default: '',
    trim: true,
    required: 'Unit cannot be blank'
  },
  chapter: {
    type: String,
    default: '',
    trim: true,
    required: 'Chapter cannot be blank'
  },
  section: {
    type: String,
    default: '',
    trim: true,
    required: 'Section cannot be blank'
  },
  rating: {
    ratingType: {
      type: String,
      default: 'rating4', // rating4, rating5, xofy, trueFalse
      enum: ['rating4', 'rating5', 'xofy', 'trueFalse']
    },
    trueFalse: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: '0'
    },
    max: {
      type: Number,
      default: '1'
    }
  }
});

/**
* Interview Schema
*/
var InterviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  interviewer: {
    type: String,
    default: '',
    trim: true,
    required: 'Interviewer cannot be blank'
  },
  candidate: {
    type: String,
    default: '',
    trim: true,
    required: 'Candidate cannot be blank'
  },
  location: {
    type: String,
    default: '',
    trim: true,
    required: 'Location cannot be blank'
  },
  position: {
    type: String,
    default: '',
    trim: true,
    required: 'Position cannot be blank'
  },
  category: {
    type: String,
    default: '',
    trim: true,
    required: 'Location cannot be blank'
  },
  questions: [QuestionSchema]
});

mongoose.model('Interview', InterviewSchema);
mongoose.model('Question', QuestionSchema);
