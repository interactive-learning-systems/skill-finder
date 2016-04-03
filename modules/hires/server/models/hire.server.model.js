'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hire Schema
 */
var QuestionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  interviewee: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  question: {
    type: String,
    default: '',
    trim: true,
    required: 'Question cannot be blank'
  },
  section: {
    sectionTopName: {
      type: String,
      default: '',
      trim: true,
      required: 'Section Top Name cannot be blank'
    },
    sectionSubName: {
      type: String,
      default: '',
      trim: true,
      required: 'Section Sub Name cannot be blank'
    }
  },
  rating: {
    ratingType: {
      type: String,
      default: 'rating5',
      trim: true
    },
    rated: {
      type: Boolean,
      default: 'false'
    },
    trueFalse: {
      type: Boolean,
      default: 'true'
    },
    value: {
      type: Number,
      default: '1'
    }
  }
});

mongoose.model('HireInterviewQuestion', QuestionSchema);
